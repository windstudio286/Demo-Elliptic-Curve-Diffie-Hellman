// Here is the complete guide to ECDSA:
// https://medium.com/@exemak/elliptic-curves-and-ecdsa-from-understanding-the-concept-to-signing-a-transaction-in-bitcoin-dd07851fe0a8
import {
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import { getSecp256k1Point, verifySignature } from "../utils/ecdsa";
import { getBN, getSha256 } from "../utils/utils";

const MESSAGE_TYPE = {
  integer: "INTEGER",
  hashed: "HASHED"
};

const parsePublicKeyString = (privateKeyString) => {
  try {
    const { x, y } = JSON.parse(privateKeyString);

    return x && y ? getSecp256k1Point(getBN(x), getBN(y)) : false;
  } catch (e) {
    return false;
  }
};

const parseSignatureString = (signatureString) => {
  try {
    const { r, s } = JSON.parse(signatureString);

    return r && s ? { r: getBN(r), s: getBN(s) } : false;
  } catch (e) {
    return false;
  }
};

export default function VerifySignatureForm() {
  const [publicKey, setPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [messageType, setMessageType] = useState(MESSAGE_TYPE.hashed);
  const [result, setResult] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const parsedSignature = parseSignatureString(signature);
  const publicKeyPoint = parsePublicKeyString(publicKey);

  const isSignatureCorrect = !!parsedSignature;
  const isPublicKeyCorrect = !!publicKeyPoint;
  const isMessageCorrect = message.length !== 0;

  const verify = () => {
    let finalMessage = message;
    if (messageType === MESSAGE_TYPE.hashed) {
      finalMessage = getSha256(message);
    }
    setResult(verifySignature(finalMessage, parsedSignature, publicKeyPoint));
    setShowResult(true);
  };

  useEffect(() => setShowResult(false), [publicKey, message, signature]);

  return (
    <Paper sx={{ p: 2, m: 3 }} elevation={4}>
      <Typography sx={{ mb: 1 }} variant="h4">
        Verify signature
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="info">
            Having a <b>PublicKey</b>, a <b>signature</b>, and an original{" "}
            <b>message</b>, we can <b>verify</b> that the message has been{" "}
            <b>signed</b> by the <b>PrivateKey</b>, from which the{" "}
            <b>PublicKey</b> was <b>extracted</b>.
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            label="PublicKey"
            helperText={
              publicKey &&
              !isPublicKeyCorrect &&
              "Must be a JSON containing x and y coordinates lying on secp256k1 curve"
            }
            variant="outlined"
            error={publicKey && !isPublicKeyCorrect}
            required
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Signature"
            onChange={(e) => setSignature(e.target.value)}
            value={signature}
            variant="outlined"
            helperText={
              signature &&
              !isSignatureCorrect &&
              "Must be a JSON containing r and s values"
            }
            error={signature && !isSignatureCorrect}
            required
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            label="Message"
            type={messageType === MESSAGE_TYPE.integer ? "number" : "default"}
            multiline={messageType !== MESSAGE_TYPE.integer}
            variant="outlined"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel name="message">Message type</FormLabel>
          <RadioGroup
            aria-labelledby="message"
            row
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
          >
            <FormControlLabel
              control={<Radio />}
              value={MESSAGE_TYPE.hashed}
              label="Hashed string (sha256)"
            />
            <FormControlLabel
              control={<Radio />}
              value={MESSAGE_TYPE.integer}
              label="Integer"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={verify}
            variant="contained"
            size="large"
            disabled={
              !isSignatureCorrect || !isMessageCorrect || !isPublicKeyCorrect
            }
          >
            Verify
          </Button>
        </Grid>
        {showResult && (
          <Grid item xs={12}>
            {result ? (
              <Alert severity="success">Signature is correct!</Alert>
            ) : (
              <Alert severity="error">Signature is not correct</Alert>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
