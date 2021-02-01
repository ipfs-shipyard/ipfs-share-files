export const perform = (type, task, ...[init]) =>
  // eslint-disable-next-line require-yield
  spawn(type, async function * (context) {
    return await task(context)
  }, init)

 export const spawn = (type, task, ...[init]) => async (context) => {
  // Generate unique id for this task
  const id = Symbol(type)
  const start = performance.now()

  try {
    context.dispatch({ type, task: { id, status: 'Init', init } })

    const process = task(context)
    while (true) {
      const next = await process.next()
      if (next.done) {
        const { value } = next
        context.dispatch({
          type,
          task: {
            id,
            status: 'Exit',
            duration: performance.now() - start,
            result: {
              ok: true, value
            }
          }
        })
        return value
      } else {
        const { value } = next
        context.dispatch({
          type,
          task: {
            id,
            status: 'Send',
            message: value
          }
        })
      }
    }
  } catch (error) {
    context.dispatch({
      type,
      task: {
        id,
        status: 'Exit',
        duration: performance.now() - start,
        result: { ok: false, error }
      }
    })
    // Propagate error to a caller.
    throw error
  }
}