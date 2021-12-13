const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

//this file was used to clean the original json files (asu-data) sent to fluree

const path = [
  //these need to be updated to reflect the actual collections & filenames (ideally it should be the same `name` value)
  "dino",
];

pathArray.forEach((name, index) => {
  let payloadString;
  try {
    payloadString = readFileSync(
      path.resolve(__dirname, `./data/${name}.json`),
      { encoding: "utf8" }
    );
  } catch (error) {
    console.log(error);
    return;
  }

  const payloadJSON = JSON.parse(payloadString);
  let finalJSON = [];
  switch (name) {
    case "dino":
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let created_by = ["participant/id", subject.created_by];
        let owner = ["participant/id", subject.owner];
        let identity = ["identity/id", subject.identity];
        let profile = ["profile/id", subject.profile];
        return {
          ...subject,
          last_updated,
          created_by,
          owner,
          identity,
          profile,
        };
      });
    default:
      break;
  }
  writeFileSync(
    path.resolve(__dirname, `./fluree-data-export/tln.${name}.json`),
    JSON.stringify(finalJSON)
  );
});
