const express = require("express");

const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const connect = () => {
  return mongoose.connect(
    // "mongodb+srv://rutuja:rutuja3562@cluster0.orwkt.mongodb.net/p?retryWrites=true&w=majority"
    "mongodb+srv://rutuja:rutuja3562@cluster0.orwkt.mongodb.net/project1?retryWrites=true&w=majority"
  );
};

// create schema
const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

const sectionSchema = new mongoose.Schema(
  {
    sectionName: { type: String },
  },
  { versionKey: false, timestamps: true }
);
const Section = mongoose.model("section", sectionSchema);

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    body: { type: String, require: true },
    sectionid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "section",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = mongoose.model("book", bookSchema);

const authorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Author = mongoose.model("author", authorSchema);

const authorbookSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "author",
      required: "true",
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: "true",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const BookAuthor = mongoose.model("bookauthor", authorbookSchema);

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    return res.status(200).send({ users: users });
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});
app.get("/sections", async (req, res) => {
  try {
    const sections = await Section.find().lean().exec();
    return res.status(200).send({ sections: sections });
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});
app.post("/sections", async (req, res) => {
  try {
    const section = await Section.create(req.body);
    return res.status(201).send(section);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find()
      .populate({ path: "sectionid", select: ["sectionName"] })
      .lean()
      .exec();
    return res.status(200).send({ books: books });
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});
app.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    return res.status(201).send(book);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});
app.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    return res.status(201).send(book);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});

app.get("/books/:bookid/section", async (req, res) => {
  try {
    var section = await Book.find({ bookid: req.params.bookid });

    return res.status(200).send(section);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});

app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find()
      .populate({
        path: "userId",
        select: { first_name: 1, last_name: 1, _id: 0 },
      })

      .lean()
      .exec();
    return res.status(200).send({ authors: authors });
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});
app.post("/authors", async (req, res) => {
  try {
    const author = await Author.create(req.body);
    return res.status(201).send(author);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});

app.delete("/authors/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    return res.status(201).send(author);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});

app.get("/bookauthors", async (req, res) => {
  try {
    const bookauthors = await BookAuthor.find()
      //   .populate("authorId")
      .populate({
        path: "authorId",
        select: ["first_name"],
        populate: { path: "userId", select: ["first_name", "last_name"] },
      })
      .populate({
        path: "bookId",
        select: { name: 1, body: 1, _id: 0 },
      })
      .lean()
      .exec();
    return res.status(200).send({ bookauthors: bookauthors });
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});
app.post("/bookauthors", async (req, res) => {
  try {
    const bookauthor = await BookAuthor.create(req.body);
    return res.status(201).send(bookauthor);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});

app.get("/bookauthors/:bookauthorid/authors", async (req, res) => {
  try {
    var bookauthors = await BookAuthor.find({
      bookauthorid: req.params.bookauthorid,
    })
      .populate({
        path: "authorId",
        select: ["first_name"],
        populate: { path: "userId", select: ["first_name", "last_name"] },
      })
      .populate({
        path: "bookId",
        select: { name: 1, body: 1, _id: 0 },
      })
      .lean()
      .exec();;
    return res.status(200).send(bookauthors);
  } catch (err) {
    return res.status(500).send({ massege: err.massege });
  }
});

app.listen(5000, async () => {
  await connect();
  console.log("Listening on port 5000");
});
