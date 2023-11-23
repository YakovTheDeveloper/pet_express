export function getKeyChanges(oldObj: { [key: string]: any }, newObj: { [key: string]: any }) {
    const addedKeys: { key: string, value: number }[] = [];
    const deletedKeys: string[] = [];
    const changedKeys: { key: string, value: number }[] = [];

    // Compare keys in the new object
    for (const key in newObj) {
        if (!(key in oldObj)) {
            addedKeys.push({
                key,
                value: newObj[key]
            });
        } else if (oldObj[key] !== newObj[key]) {
            changedKeys.push({
                key,
                value: newObj[key]
            });
        }
    }

    // Compare keys in the old object
    for (const key in oldObj) {
        if (!(key in newObj)) {
            deletedKeys.push(key);
        }
    }

    return {
        addedKeys,
        deletedKeys,
        changedKeys
    }

    console.log("Added keys:", addedKeys);
    console.log("Deleted keys:", deletedKeys);
    console.log("Changed keys:", changedKeys);
}