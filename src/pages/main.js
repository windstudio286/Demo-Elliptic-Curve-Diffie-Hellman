// Here is the complete guide to ECDSA:
// https://medium.com/@exemak/elliptic-curves-and-ecdsa-from-understanding-the-concept-to-signing-a-transaction-in-bitcoin-dd07851fe0a8
import { Container } from "@mui/material";
import ExtractPublicKeyForm from "../components/ExtractPublicKeyForm";
import SignMessageForm from "../components/SignMessageForm";
import VerifySignatureForm from "../components/VerifySignatureForm";

export default function MainPage() {
  return (
    <Container>
      <ExtractPublicKeyForm />
      <SignMessageForm />
      <VerifySignatureForm />
    </Container>
  );
}
