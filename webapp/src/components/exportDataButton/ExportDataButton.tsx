import { gridClasses, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import React, { ReactElement } from "react";

const ExportDataButton = (): ReactElement => (
  <GridToolbarContainer className={gridClasses.toolbarContainer}>
    <GridToolbarExport
      printOptions={{
        allColumns: true
      }}
    />
  </GridToolbarContainer>
);

export default ExportDataButton;
