/**
* ███████╗███████╗████████╗██╗   ██╗██████╗ 
* ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
* ███████╗█████╗     ██║   ██║   ██║██████╔╝
* ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ 
* ███████║███████╗   ██║   ╚██████╔╝██║     
* ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     
*/

const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const Post = require('./public/js/Post');  // Import the Post model

// Initialize the express app
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json());  // To parse JSON data

// Serve static files like CSS and images
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/forumDB', {
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Error connecting to MongoDB:", err);
});

/**
* ██████╗  ██████╗ ██╗   ██╗████████╗███████╗███████╗
* ██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔════╝
* ██████╔╝██║   ██║██║   ██║   ██║   █████╗  ███████╗
* ██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ╚════██║
* ██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗███████║
* ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚══════╝
*/
// Home page route
app.get('/', (req, res) => {
    res.render('home');  // Render home.ejs
});

// About page route
app.get('/about', (req, res) => {
    res.render('about');  // Render about.ejs
});

// Forum page route
app.get('/forum', async (req, res) => {
    try {
        // Fetch all posts from the database, sorted by creation date
        const posts = await Post.find().sort({ createdAt: -1 });
        
        // Render the forum page and pass the posts data to the view
        res.render('forum', { title: 'Forum', posts: posts });
    } catch (err) {
        res.status(500).send('Error fetching posts');
    }
});

// Route to view an individual post by ID
app.get('/forum/:id', async (req, res) => {
    try {

    const adminPassword = 'Powered by Node.js, Nginx, MongoDB, Cloudflare, and Google Cloud';

    if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.send('Invalid credentials'); // Or consider rendering the login page again with an error message
    }
});


// Admin Dashboard - only accessible if logged in
app.get('/admin', adminAuth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.render('admin', { title: 'Admin Dashboard', posts });
    } catch (err) {
        res.status(500).send('Error fetching posts for admin');
    }
});

// Logout Route for Admin
app.post('/admin/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/admin/login'); // Redirect to login page
});

// Route to delete a post by ID
app.post('/admin/delete-post/:id', adminAuth, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id); // Delete the post
        res.redirect('/admin'); // Redirect back to the admin dashboard
    } catch (err) {
        res.status(500).send('Error deleting post');
    }
});

app.post('/admin/delete-comment/:postId/:commentId', adminAuth, async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Find the comment by id in the comments array
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).send('Comment not found');
        }

        // Remove the comment from the comments array
        post.comments.splice(commentIndex, 1);

        // Save the updated post
        await post.save();

        res.redirect('/admin'); // Redirect to the admin dashboard
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).send('Error deleting comment');
    }
});



/**
* ███████╗████████╗ █████╗ ██████╗ ████████╗
* ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝
* ███████╗   ██║   ███████║██████╔╝   ██║   
* ╚════██║   ██║   ██╔══██║██╔══██╗   ██║   
* ███████║   ██║   ██║  ██║██║  ██║   ██║   
* ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
*/
// Start the server on port 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});