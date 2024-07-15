import jwt from "jsonwebtoken";

export function signToken(
  payload: string | object | Buffer,
  secretOrPrivateKey: jwt.Secret,
  expiresIn?: string | number,
) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secretOrPrivateKey,
      {
        expiresIn,
      },
      (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      },
    );
  });
}

export function verifyToken(token: string, secretOrPublicKey: jwt.Secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
}
