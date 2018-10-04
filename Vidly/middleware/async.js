// We dont need this since we are using an NPM package called
// express-async-errors
module.exports = function(handler) {
    return async (req, res , next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            next(ex);
        }
    };  
}