import { Box, Typography } from "@mui/material";
import { ReactElement } from "react";
import { padding } from "../../theme/Theme";

export const InfoText = (): ReactElement => 
     <Typography sx={{ paddingBottom: padding.large }}>
        <Box sx={{display: 'flex'}}>
            <p>Här kan du som ska med på kommande kompetenskonferens registrera dina bidrag.
            <br/>
            Ämnen som har en tydlig koppling till Omegapoints verksamhet eller tidigare
            trendspaningar prioriteras.
<br/>
            Accept av bidrag kan ske löpande.
            <br />
            Programutskottet förbehåller sig rätten att redigera och korta ned beskrivningar och
            texter för att passa in i programmet.<br />
            Vår ambition är att kunna acceptera alla bidrag men hänsyn tas till plats i schema,
            ämnesval samt hur bra beskrivet, genomtänkt och förberett det inskickade förslaget är.
            <br />
            <br />
            </p>
            <Box sx={{flexDirection: 'column', color: '#666666'}}>
            <p>- Prata hellre om något du vill prata om än något du tror andra vill höra om.
            <br />
            - Ni behöver inte ha en helt färdig presentation för att skicka in CfP, använd det som
            motivation till att sluta prokrastinera.
            <br />
            - Beskrivning och titel kan vara helt avgörande. Sälj in er och ert ämne!
            <br />
            - Ingen idé är för dum eller tokig, det värsta som kan hända är att ni får feedback om
            hur det skulle kunna bli ännu bättre!
            <br />
            - Kör bara, det blir kul!
            </p>
            </Box>
        </Box>
    </Typography>;
