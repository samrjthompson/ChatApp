
// this function takes a function as a parameter and returns a new function that passes the catch onto next
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}