/**
   * 根据路径操作对象，路径处是对象则返回
   * @param {object} data 数据源
   * @param {string} path 路径
   * @param {*} result 如不为undefined则为type路径赋值
   * @param {boolean} deep 返回的object对象是否深拷贝 
   * @returns 
   */
  export function objectUrlEval(data, path, result, deep) {
    let pathList = path.split('.')
    let temp = data
    for (let i = 0; i < pathList.length; i++) {
      if (temp[pathList[i]].toString() === '[object Object]') {//是对象
        if (i === pathList.length - 1) {
          if (result !== undefined) {
            temp[pathList[i]] = result
          }
          return deep ? JSON.parse(JSON.stringify(temp[pathList[i]])) : temp[pathList[i]]
        } else {
          temp = temp[pathList[i]];
          continue
        }
      }
      if (i === pathList.length - 1) {
        console.log(temp[pathList[i]])
        if (result !== undefined) {
          temp[pathList[i]] = result
        }
        return temp[pathList[i]]
      } else {
        throw new Error('对象路径中存在非对象属性!')
      }
    }
  }

  export function debounce(callback, wait) {
    let timer = null;
    return function(){
      let _this = this,arg = arguments;
      if(!!timer){
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(function(){
        callback.call(_this,arg)
      },wait)
    }
  }