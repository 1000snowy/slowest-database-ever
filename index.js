const fs = require("fs")

module.exports = class Database {
    constructor(filename) {
        this.filename = filename + ".json";
        this.database = require("./" + filename + ".json");
    };

    set(key, value) {
        function set(key, value, object) {
            key = key.split(".");
            const length = key.length;
            const lastIndex = length - 1;

            let index = -1;
            let nested = object;

            while (nested != null && ++index < length) {
                const data = key[index]
                let newValue = value

                if (index != lastIndex) {
                    const objValue = nested[data]
                    newValue = (typeof objValue === "object") ? objValue : {}
                }
                nested[data] = newValue;
                nested = nested[data];
            }

            return object;
        };

        fs.writeFileSync(this.filename, JSON.stringify(this.database));
        return set(key, value, this.database, this.filename);
    };

    get(key) {
        function get(path, object) {
            path = path.split(".")

            let index = 0
            const length = path.length

            while (object != null && index < length) {
                object = object[path[index++]]
            }

            return (index && index == length) ? object : undefined
        };

        return get(key, this.database);
    }
};