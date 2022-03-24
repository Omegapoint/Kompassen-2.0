import { Typography } from "@mui/material";
import { ReactElement } from "react";
import { padding } from "../../theme/Theme";

export const InfoText = (): ReactElement => {
    return <Typography sx={{ paddingBottom: padding.large }}>
        <p>
            Här kan du som ska med på kommande kompetenskonferens registrera dina bidrag.
            <br />
            Ämnen som har en tydlig koppling till Omegapoints verksamhet eller tidigare
            trendspaningar prioriteras.
            <br />
            <br />
            Accept av bidrag kan ske löpande, väntar du för länge med din anmälan kan platserna vara
            slut.
            <br />
            <br />
            Programutskottet förbehåller sig rätten att redigera och korta ner beskrivningar och
            texter för att passa in i programmet.<br />
            Vår ambition är att kunna acceptera alla bidrag men hänsyn tas till plats i schema,
            ämnesval samt hur bra beskrivet, genomtänkt och förberett det inskickade förslaget är.
            <br />
            <br />
            Tips från coachen:
            <br />
            - Prata hellre om något du vill prata om än något du tror andra vill höra om.
            <br />
            - Ni behöver inte ha en helt färdig presentation för att skicka in CfP, använd det som
            motivation till att sluta prokrastinera.
            <br />
            - Beskrivning och titel kan vara helt avgörande. Sälj in dig och ditt ämne!
            <br />
            - Ingen idé är för dum eller tokig, det värsta som kan hända är att du får feedback om
            hur det skulle kunna bli ännu bättre!
            <br />
            - Kör bara, det blir kul!
            <br />
            <br />
            <br />
            <b>Deadline för registrering av bidrag är kl. 23.59 den 17 april 2022!</b>
        </p>
    </Typography>;
}