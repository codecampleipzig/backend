import { Request, Response, NextFunction } from "express";

import { generatePutUrl } from "./AWSPresigner";

// This may be used if we want to secure Get Requests for Fileuploads
// export const getGeneratedGetUrl = async (req: Request, res: Response, next: NextFunction) => {
//   // Both Key and ContentType are defined in the client side.
//   // Key refers to the remote name of the file.
//   const { Key } = req.body;
//   generateGetUrl(Key)
//     .then(getURL => {      
//       res.send(getURL);
//     })
//     .catch(err => {
//       res.send(err);
//     });
// }

export const getGeneratedPutUrl = async (req: Request, res: Response, next: NextFunction) => {
  // Both Key and ContentType are defined in the client side.
  // Key refers to the remote name of the file.
  // ContentType refers to the MIME content type, in this case image/jpeg
  console.log(req.query);
  const { Key, ContentType } = req.query;
  console.log(Key);
  console.log(ContentType);
  generatePutUrl(Key, ContentType).then(putURL => {
    res.send({putURL});
  })
  .catch(err => {
    res.send(err);
  });
}