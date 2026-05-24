import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[SERVER]: Text-to-Speech API listening on port ${port}`);
});
