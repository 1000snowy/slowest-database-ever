function baseGet(object, path) {
    path = path.split(".")
  
    let index = 0
    const length = path.length
  
    while (object != null && index < length) {
      object = object[path[index++]]
    }
    return (index && index == length) ? object : undefined
  }