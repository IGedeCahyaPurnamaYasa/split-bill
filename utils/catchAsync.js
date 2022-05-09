module.exports = fn => {
    return (req, res, next) => {
        console.log(req, res, next);
        fn(req, res, next).catch(next)
    }
}