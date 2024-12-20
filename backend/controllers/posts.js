import Post from '../models/post.js';

export const getPosts = async (request, response) => {
    Post.find()
        .populate("username", "_id name")
        .populate("comments.username", "_id name")
        .sort('-createdAt')
        .then((posts) => {
            response.json({ posts })
        }).catch(error => {
            console.log(error)
        })
}

export const getPost = async (request, response) => {
    const { id } = request.params;

    try {
        const post = await Post.findById(id);
        if (!post) return response.status(404).json({ message: 'Could not find post' });
        response.status(200).json(post);
    } catch (error) {
        response.status(404).json({ message: error.message });
    }
}

export const createPost = async (request, response) => {
    try {
        const { title, message, file, username } = request.body
        if (!title || !message) {
            return response.status(422).json({ error: "Plase add all the fields" })
        }
        const post = new Post({
            title,
            message,
            file,
            username,
            //postedBy: request.user
        })
        post.save().then(result => {
            response.json({ post: result })
        })
            .catch(error => {
                console.log(error)
            })
    } catch (error) {
        response.status(500).send({ message: error.message });
        console.log(error);
    }
}

export const deletePost = async (request, response) => {
    try {
        Post.findOne({ _id: request.params.id })
            .populate("username", "_id")
            .then((post) => {
                if (!post) {
                    return response.status(422).json({ error: error })
                }
                if (post.username === request.headers.username) {
                    Post.findByIdAndDelete({ _id: request.params.id })
                        .then(result => {
                            response.json(result)
                        }).catch(error => {
                            console.log(error)
                        })
                }
            })
            .catch(error => {
                return response.status(422).json({ error: error })
            })
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
}

export const likePost = async (request, response) => {
    try {
        Post.findByIdAndUpdate(request.body.postId, {
            $push: { likes: request.body.username }
        }, {
            new: true
        }).then((result) => {
            response.json(result)
        }
        ).catch(error => {
            return response.status(422).json({ error: error })
        })
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
}

export const unlikePost = async (request, response) => {
    try {
        Post.findByIdAndUpdate(request.body.postId, {
            $pull: { likes: request.body.username }
        }, {
            new: true
        }).then((result) => {
            response.json(result)
        }
        ).catch(error => {
            return response.status(422).json({ error: error })
        })
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
}

export const commentPost = async (request, response) => {
    try {
        const comment = {
            text: request.body.text,
            username: request.body.username,
            userId: request.body.userId,
        }
        Post.findByIdAndUpdate(request.body.postId, {
            $push: { comments: comment }
        }, {
            new: true
        })
            .populate("comments.username", "_id name")
            .populate("username", "_id name")
            .then((result) => {
                response.json(result)
            }).catch(error => {
                return response.status(422).json({ error: error })
            }) 
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

export const myPost = async (request, response) => {
    Post.find({username: request.params.username})
    .populate("username","_id name")
    .then(mypost=>{
        response.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
}