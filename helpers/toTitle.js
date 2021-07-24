//function to convert kebab case (from url params) into title case (for database)

function toTitle(string) {
  return string
    .split("-")
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

module.exports = { toTitle };
