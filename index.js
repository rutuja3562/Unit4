const express = require("express");
// const mongoose = require("mongoose");
const app = express();
// app.use(express.json());
const connect = () => {
  return mongoose.connect(
    "mongodb+srv://rutuja:rutuja3562@cluster0.orwkt.mongodb.net/project1?retryWrites=true&w=majority"
    // "mongodb+srv://dhaval:dhaval_123@cluster0.ljuvz.mongodb.net/web15-atlas?retryWrites=true&w=majority"
  );
};

// create schema

const authorSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

// create model

const Author = mongoose.model("author", authorSchema);

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    body: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Book = mongoose.model("book", bookSchema);

const sectionSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "author",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Section = mongoose.model("section", sectionSchema);

const authorbookschema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "author",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Authorbook = mongoose.model("authorBook", authorbookschema);

app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find().lean().exec();

    return res.status(200).send({ authors: authors }); // []
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong .. try again later" });
  }
});

app.post("/authors", async (req, res) => {
  try {
    const author = await Author.create(req.body);
    return res.status(201).send(author);
  } catch (err) {
    return res.status(500).send({ massege: res.massege });
  }
});

app.get("/authors/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).lean().exec();
    return res.status(200).send({ author: author });
  } catch (err) {
    return res.status(500).send({ massege: res.massege });
  }
});

// app.get("/authors/:authorsId/books", async (req, res) => {
//   try {
//     const books = await Author.find({ authorsId: req.params.authorsId })
//       .lean()
//       .exec();
//     return res.status(500).send({ books });
//   } catch (err) {
//     return res.status(501).send({ massege: err.massage });
//   }
// });

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find().lean().exec();

    return res.status(200).send({ books: books }); // []
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Something went wrong .. try again later" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    return res.status(201).send(book);
  } catch (err) {
    return res.status(500).send({ massege: res.massege });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const books = await Book.findById(req.params.id).lean().exec();
    return res.status(200).send({ books: books });
  } catch (err) {
    return res.status(500).send({ massege: res.massege });
  }
});

app.get("/authorbook", async (req, res) => {
  try {
    const authorbooks = await Authorbook.find()
      .populate({ path: "authorId", select: ["first_name", "last_name"] })
      .populate({ path: "bookId", select: ["name", "body"] })
      .lean()
      .exec();

    return res.status(200).send({ authorbooks: authorbooks }); // []
  } catch (err) {
    return res.status(500).send({ massege: res.massege });
  }
});

app.post("/authorbook", async (req, res) => {
  try {
    const authorbook = await Authorbook.create(req.body);
    return res.status(201).send(authorbook);
  } catch (err) {
    return res.status(500).send({ massege: res.massege });
  }
});

app.get("/authorbook/:id", async (req, res) => {
  try {
    const authorbooks = await Authorbook.findById(req.params.id).lean().exec();
    return res.status(200).send({ authorbooks: authorbooks });
  } catch (err) {
    return res.status(500).send({ massege: res.massege });
  }
});

app.get("/authors/:authorId/books", async (req, res) => {
  // console.log(req.params.authorId);
  try {
    const books = await Book.find({
      authorId: req.params.authorId,
    })
      .lean()
      .exec();
    return res.status(500).send({ books: books });
  } catch (err) {
    return res.status(501).send({ massege: err.massage });
  }
});
app.get("/authorbook/:bookId/authors", async (req, res) => {
  // console.log(req.params.authorId);
  try {
    const authors = await Author.find({
      bookId: req.params.bookId,
    })
      .lean()
      .exec();
    return res.status(500).send({ authors: authors });
  } catch (err) {
    return res.status(501).send({ massege: err.massage });
  }
});

// app.listen(5000, async (req, res) => {
//   try {
//     await connect();
//   } catch (err) {
//     console.log(err);
//   }

//   console.log("Listening on port 5000");
// });
