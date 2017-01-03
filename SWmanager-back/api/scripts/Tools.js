/**
 * Created by kevin on 03/01/2017.
 */

exports.dataToJson = function(value) {
    return JSON.parse(value.replace(/\\/gi, "").slice(1, -1));
};