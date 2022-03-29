import { OAuth2Client, TokenPayload } from "google-auth-library";

export const googleVeryfy = async (token:string) : Promise<TokenPayload> => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  //-Se deben agregar todos los token id de las aplicaciones que pasen por esta validacion
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: [
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_AUTH_APP_CLIENT_ID!
    ]
  })

  const payload = ticket.getPayload();

  return payload!;
}