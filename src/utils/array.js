export const FindIndexByKeyValue = (arr, key, value) => {
    let x = 0, found = false;
    while (!found && x < arr.length) {
        if (arr[x][key] === value) found = true;
        else x++;
    }
    return found ? x : -1;
}

export const FindItemByKeyValue = (arr, key, value) => {
    let index = FindIndexByKeyValue(arr, key, value);
    return index >= 0 ? arr[index] : null;
}