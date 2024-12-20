import jwt from 'jsonwebtoken';

// user wants to like a post
// user clicks the like button => it goes to auth middleware(next) => if authentication
// is successfull, it calls next() function ie likePost route hence middleware is middle 
// between action and calling a route for that action

const auth = async (request, response, next) => {
    try {
        const token = request.cookies.token;
        const isCustomAuth = token.length < 500;
        // if < 500, it is a route...
        // else then it is a google auth 

        let decodedData;
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.SECRET_KEY);
            request.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            request.userId = decodedData?.sub;
        }
        next();
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: error.message });
    }
}

export default auth;
