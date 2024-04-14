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
  Alert,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";
import { GPoint } from "../utils/ecdsa";
import { getLargeRandom } from "../utils/utils";

const DISPLAY_VARIANT = {
  jsonDec: "JSON_DEC",
  jsonHex: "JSON_HEX"
};

export default function ExtractPublicKeyForm() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState({
    actualPrivateKey: "1",
    point: GPoint
  });
  const [displayVariant, setDisplayVariant] = useState(DISPLAY_VARIANT.jsonDec);

  const isPrivateKeyValid = !Number.isNaN(Number(privateKey));

  const extractPublicKey = (privateKey) => {
    setPublicKey({
      actualPrivateKey: privateKey,
      point: GPoint.multiply(privateKey)
    });
  };

  const generateRandom = () => {
    const randomPrivateKey = getLargeRandom();
    setPrivateKey(randomPrivateKey);
    extractPublicKey(randomPrivateKey);
  };

  const displayedPublicKey = useMemo(() => {
    if (publicKey.actualPrivateKey !== privateKey) {
      return null;
    }

    switch (displayVariant) {
      case DISPLAY_VARIANT.jsonDec:
        return JSON.stringify(
          {
            x: publicKey.point.x.toFixed(),
            y: publicKey.point.y.toFixed()
          },
          null,
          2
        );

      case DISPLAY_VARIANT.jsonHex:
        return JSON.stringify(
          {
            x: "0x" + publicKey.point.x.toString(16),
            y: "0x" + publicKey.point.y.toString(16)
          },
          null,
          2
        );

      default:
        return null;
    }
  }, [
    publicKey.actualPrivateKey,
    privateKey,
    displayVariant,
    publicKey.point.x,
    publicKey.point.y
  ]);

  return (
    <Paper sx={{ p: 2, m: 3 }} elevation={4}>
      <Typography sx={{ mb: 1 }} variant="h4">
        Extract PublicKey
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="info">
            <b>PrivateKey</b> in ECDSA is any random number. Usually, you keep
            it secret. You use it to <b>sign messages</b>.
            <br />
            <b>PublicKey</b> is a point on an elliptic curve, which you can
            share with anyone, so they can use it to <b>verify</b> your{" "}
            <b>signatures</b>.
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            label="PrivateKey"
            variant="outlined"
            required
            error={!isPrivateKeyValid}
            helperText={
              !isPrivateKeyValid &&
              "Must be decimal or hex number like 1234, 0xfff, 0x12abf..."
            }
            fullWidth
          />
        </Grid>
        <Button
          sx={{ ml: 2, mt: 2 }}
          onClick={() => extractPublicKey(privateKey)}
          variant="contained"
          disabled={!isPrivateKeyValid || !privateKey}
          size="large"
        >
          Extract
        </Button>
        <Button
          sx={{ ml: 2, mt: 2 }}
          onClick={generateRandom}
          // sx={{ml:2}}
          variant="outlined"
          size="large"
        >
          Random & Extract
        </Button>

        {displayedPublicKey && (
          <>
            <Grid item xs={12}>
              <Typography variant="h4">Public key:</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                value={displayedPublicKey}
                variant="outlined"
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel name="public-key-format">How to represent?</FormLabel>
              <RadioGroup
                aria-labelledby="public-key-format"
                row
                value={displayVariant}
                onChange={(e) => setDisplayVariant(e.target.value)}
              >
                <FormControlLabel
                  control={<Radio />}
                  value={DISPLAY_VARIANT.jsonDec}
                  label="JSON decimal"
                />
                <FormControlLabel
                  control={<Radio />}
                  value={DISPLAY_VARIANT.jsonHex}
                  label="JSON hexadecimal"
                />
              </RadioGroup>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}
