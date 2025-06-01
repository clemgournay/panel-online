export const GetObjectValues = (obj) => {
    let values = [];
    for (let key in obj) {
        values.push(obj[key]);
    }
    return values;
}

export const CloneObject = (obj, deep = false) => {
    let result = {};
    for (let key in obj) {

        if (deep && obj[key] instanceof Object) {
            console.log(obj[key] instanceof Object)
            if (obj[key] instanceof Array) {
                result[key] = [];
                for (let item of obj[key]) {
                    if (item instanceof Object) result[key].push(CloneObject(item, true));
                    else result[key].push(item);
                }
            } else {
                result[key] = CloneObject(obj[key]);
            }
        } else {
            result[key] = obj[key];
        }
    }
    return result
  }
  