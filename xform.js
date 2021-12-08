const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

//this file was used to clean the original json files (asu-data) sent to fluree

const pathArray = [
  //these need to be updated to reflect the actual collections & filenames (ideally it should be the same `name` value)
  'identity',
  'address',
  'endorsement_claim',
  'verification',
  'system_identifier',
  'cryptographic_key',
  'endorsement_profile',
  'endorsement',
  'profile',
  'alignment',
  'association',
  'result',
  'participant',
  'result_description',
  'criteria',
  'achievement',
  'artifact',
  'evidence',
  'assertion',
  'clr',
  'identification',
];

pathArray.forEach((name, index) => {
  let payloadString;
  try {
    payloadString = readFileSync(
      path.resolve(__dirname, `./data-export/tln.${name}.json`),
      { encoding: 'utf8' }
    );
  } catch (error) {
    console.log(error);
    return;
  }

  const payloadJSON = JSON.parse(payloadString);
  let finalJSON = [];
  switch (name) {
    case 'identity':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let created_by = { _id: 'participant', id: subject.created_by };
        return { ...subject, last_updated, created_by };
        //do some transform logic SPECIFIC TO "IDENTITY" COLLECTION SUBJECTS to make subject ready for transaction
      });
      break;
    case 'participant':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);

        return { ...subject, last_updated };
      });
      break;
    case 'result_description':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        return { ...subject, last_updated };
      });
      break;
    case 'address':
      debugger;
      finalJSON = payloadJSON.map((subject) => {
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let created_by = { _id: 'participant', id: subject.created_by };
        return { ...subject, last_updated, created_by };
        //do some transform logic SPECIFIC TO "IDENTITY" COLLECTION SUBJECTS to make subject ready for transaction
      });
      break;
    case 'alignment':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let created_by = { _id: 'participant', id: subject.created_by };
        return { ...subject, last_updated, created_by };
        //do some transform logic SPECIFIC TO "ALIGNMENT" COLLECTION SUBJECTS to make subject ready for transaction
      });
      break;
    case 'profile':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let birthdate = new Date(subject.birthdate);
        birthdate = birthdate.getTime();
        let address = [{ _id: 'address', id: subject.address }];
        let created_by = [
          {
            _id: 'participant',
            id: subject.created_by,
          },
        ];
        return { ...subject, last_updated, birthdate, address, created_by };
      });
      break;
    case 'result':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let created_by = ['participant/id', subject.created_by];
        let alignment = ['alignment/id', subject.alignment];
        return { ...subject, last_updated, created_by, alignment };
      });
      break;
    case 'achievement':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let created_by = ['participant/id', subject.created_by];
        let alignments = subject.alignments;
        let issuer = ['profile/id', subject.issuer];
        let result_descriptions = subject.result_descriptions;
        let newAlignments;

        if (alignments) {
          newAlignments = alignments.map((item) => {
            item = ['alignment/id', item];
            return item;
          });
        }
        let newRD;
        if (result_descriptions) {
          newRD = result_descriptions.map((item) => {
            item = ['result_description/id', item];
            return item;
          });
        }

        return {
          ...subject,
          last_updated,
          created_by,
          alignments: newAlignments,
          issuer,
          result_descriptions: newRD,
        };
      });
      break;
    case 'assertion':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let issued_on = new Date(subject.issued_on);
        issued_on = issued_on.getTime();
        let created_by = ['participant/id', subject.created_by];
        let achievement = ['achievement/id', subject.achievement];
        let results = subject.results;
        let recipient = ['identity/id', subject.recipient];
        let source = ['profile/id', subject.source];

        let newResults;
        if (results === null) {
          return;
        } else {
          newResults = results.map((item) => {
            item = ['result/id', item];
            return item;
          });
        }
        return {
          ...subject,
          last_updated,
          issued_on,
          created_by,
          achievement,
          results: newResults,
          recipient,
          source,
        };
      });
      break;
    case 'identification':
      finalJSON = payloadJSON.map((subject) => {
        debugger;
        let last_updated = new Date(subject.last_updated);
        last_updated = last_updated.getTime();
        let created_by = ['participant/id', subject.created_by];
        let owner = ['participant/id', subject.owner];
        let identity = ['identity/id', subject.identity];
        let profile = ['profile/id', subject.profile];
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