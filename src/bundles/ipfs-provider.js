import HttpClient from 'ipfs-http-client'
import multiaddr from 'multiaddr'
import * as Enum from './enum'
import { getIpfs, providers } from 'ipfs-provider'
import { perform } from './task'


export const ACTIONS = Enum.from([
  'IPFS_INIT',
  'IPFS_STOPPED',
  'IPFS_API_ADDRESS_UPDATED',
  'IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION',
  'IPFS_API_ADDRESS_INVALID',
  'IPFS_API_ADDRESS_INVALID_DISMISS',
  // Notifier actions
  'IPFS_CONNECT_FAILED',
  'IPFS_CONNECT_SUCCEED',
  'NOTIFY_DISMISSED'
])

/**
 * @param {Model} state
 * @param {Message} message
 * @returns {Model}
 */
const update = (state, message) => {
  switch (message.type) {
    case ACTIONS.IPFS_INIT: {
      const { task } = message
      switch (task.status) {
        case 'Init': {
          return { ...state, ready: false }
        }
        case 'Exit': {
          const { result } = task
          if (result.ok) {
            const { provider, apiAddress, ipfs: service } = result.value
            ipfs = service
            return {
              ...state,
              ready: true,
              failed: false,
              provider,
              apiAddress: apiAddress || state.apiAddress
            }
          } else {
            return {
              ...state,
              ready: false,
              failed: true
            }
          }
        }
        default: {
          return state
        }
      }
    }
    case ACTIONS.IPFS_STOPPED: {
      return { ...state, ready: false, failed: false }
    }
    case ACTIONS.IPFS_API_ADDRESS_UPDATED: {
      return { ...state, apiAddress: message.payload, invalidAddress: false }
    }
    case ACTIONS.IPFS_API_ADDRESS_INVALID: {
      return { ...state, invalidAddress: true }
    }
    case ACTIONS.IPFS_API_ADDRESS_INVALID_DISMISS: {
      return { ...state, invalidAddress: true }
    }
    case ACTIONS.IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION: {
      const { pending } = message
      return { ...state, pendingFirstConnection: pending }
    }
    case ACTIONS.IPFS_CONNECT_SUCCEED: {
      return { ...state, failed: false }
    }
    case ACTIONS.IPFS_CONNECT_FAILED: {
      return { ...state, failed: true }
    }
    default: {
      return state
    }
  }
}

/**
 * @returns {Model}
 */
const init = () => {
  return {
    apiAddress: readAPIAddressSetting(),
    provider: null,
    failed: false,
    ready: false,
    invalidAddress: false,
    pendingFirstConnection: false
  }
}

const readAPIAddressSetting = () => {
  const setting = readSetting('ipfsApi')
  return setting == null ? null : asAPIOptions(setting)
}

const asAPIOptions = (value) => asHttpClientOptions(value) || asMultiaddress(value) || asURL(value)

const asURL = (value) => {
  try {
    return new URL(value).toString()
  } catch (_) {
    return null
  }
}

const asMultiaddress = (value) => {
  // ignore empty string, as it will produce '/'
  if (value != null && value !== '') {
    try {
      return multiaddr(value).toString()
    } catch (_) {}
  }
  return null
}

const asHttpClientOptions = (value) =>
  typeof value === 'string' ? parseHTTPClientOptions(value) : readHTTPClinetOptions(value)

const parseHTTPClientOptions = (input) => {
  // Try parsing and reading as json
  try {
    return readHTTPClinetOptions(JSON.parse(input))
  } catch (_) {}

  // turn URL with inlined basic auth into client options object
  try {
    const uri = new URL(input)
    const { username, password } = uri
    if (username && password) {
      return {
        host: uri.hostname,
        port: uri.port || (uri.protocol === 'https:' ? '443' : '80'),
        protocol: uri.protocol.slice(0, -1), // trim out ':' at the end
        apiPath: (uri.pathname !== '/' ? uri.pathname : 'api/v0'),
        headers: {
          authorization: `Basic ${btoa(username + ':' + password)}`
        }
      }
    }
  } catch (_) { }

  return null
}

const readHTTPClinetOptions = (value) => {
  // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#importing-the-module-and-usage
  if (value && (value.host || value.apiPath || value.protocol || value.port || value.headers)) {
    return value
  } else {
    return null
  }
}

const readSetting = (id) => {
  /** @type {string|null} */
  let setting = null
  if (window.localStorage) {
    try {
      setting = window.localStorage.getItem(id)
    } catch (error) {
      console.error(`Error reading '${id}' value from localStorage`, error)
    }

    try {
      return JSON.parse(setting || '')
    } catch (_) {
      // res was probably a string, so pass it on.
      return setting
    }
  }

  return setting
}

const writeSetting = (id, value) => {
  try {
    window.localStorage.setItem(id, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing '${id}' value to localStorage`, error)
  }
}

let ipfs = null

const extra = {
  getIpfs () {
    return ipfs
  }
}

const selectors = {
  selectIpfsReady: state => state.ipfs.ready,
  selectIpfsProvider: state => state.ipfs.provider,
  selectIpfsApiAddress: state => state.ipfs.apiAddress,
  selectIpfsInvalidAddress: state => state.ipfs.invalidAddress,
  selectIpfsInitFailed: state => state.ipfs.failed,
  selectIpfsPendingFirstConnection: state => state.ipfs.pendingFirstConnection
}

const actions = {
  doTryInitIpfs: () => async ({ store }) => {
    // There is a code in `bundles/retry-init.js` that reacts to `IPFS_INIT`
    // action and attempts to retry.
    try {
      await store.doInitIpfs()
      return true
    } catch (_) {
      // Catches connection errors like timeouts
      return false
    }
  },

  doInitIpfs: () => perform('IPFS_INIT',
    async (context) => {
      const { apiAddress } = context.getState().ipfs

      const result = await getIpfs({
        loadHttpClientModule: () => HttpClient,
        providers: [
          providers.httpClient({ apiAddress })
        ]
      })

      if (!result) {
        throw Error(`Could not connect to the IPFS API (${apiAddress})`)
      } else {
        return result
      }
    }),

    doStopIpfs: () => async (context) => {
        if (ipfs) {
        await ipfs.stop()
        context.dispatch({ type: 'IPFS_STOPPED' })
        }
    },

  /**
   * @param {string} address
   * @returns {function(Context):Promise<boolean>}
   */
  doUpdateIpfsApiAddress: (address) => async (context) => {
    const apiAddress = asAPIOptions(address)
    if (apiAddress == null) {
      context.dispatch({ type: ACTIONS.IPFS_API_ADDRESS_INVALID })
      return false
    } else {
      await writeSetting('ipfsApi', apiAddress)
      context.dispatch({ type: ACTIONS.IPFS_API_ADDRESS_UPDATED, payload: apiAddress })

      context.dispatch({
        type: ACTIONS.IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION,
        pending: true
      })
      context.dispatch({
        type: ACTIONS.IPFS_STOPPED
      })
      context.dispatch({
        type: ACTIONS.NOTIFY_DISMISSED
      })
      const succeeded = await context.store.doTryInitIpfs()
      if (succeeded) {
        context.dispatch({
          type: ACTIONS.IPFS_CONNECT_SUCCEED
        })
      } else {
        context.dispatch({
          type: ACTIONS.IPFS_CONNECT_FAILED
        })
      }
      context.dispatch({
        type: ACTIONS.IPFS_API_ADDRESS_PENDING_FIRST_CONNECTION,
        pending: false
      })
      return succeeded
    }
  },

  doDismissIpfsInvalidAddress: () => (context) => {
    context.dispatch({ type: 'IPFS_API_ADDRESS_INVALID_DISMISS' })
  },

  doGetPathInfo: (path) => async () => {
    if (ipfs) {
      return await ipfs.files.stat(path)
    } else {
      throw Error('IPFS is not initialized')
    }
  },

  doCheckIfPinned: (cid) => async () => {
    if (ipfs == null) {
      return false
    }

    try {
      const value = await first(ipfs.pin.ls({ paths: [cid], type: 'recursive' }))
      return !!value
    } catch (_) { return false }
  }
}

const bundle = {
  name: 'ipfs',
  reducer: (state, message) => update(state == null ? init() : state, message),
  getExtraArgs () {
    return extra
  },
  ...selectors,
  ...actions
}

export default bundle
