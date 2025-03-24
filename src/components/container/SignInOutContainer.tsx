import { Box, Paper, Tab, Tabs, TabsProps } from "@mui/material";
import React, { useState } from "react";
import LoginComponent from "../LoginComponent";
import SignupComponent from "../SignupComponent";

function CustomTabPanel(props: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
const SignInOutContainer = () => {
  const [value, setValue] = React.useState<number>(0);

  const onChange = (newValue: number) => {
    setValue(newValue);
  }

  const handleChange: TabsProps['onChange'] = (_event, newValue) => {
    onChange(newValue);
  };

  return (
    <Paper
      elevation={20}
      sx={{ padding: 3, width: 400, boxShadow: 3, margin: "20px auto" }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="SignIn/SignUp Tabs"
        centered
      >
        <Tab label="Sign In" />

        <Tab label="Sign Up" />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <LoginComponent handleChange={onChange} />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <SignupComponent />
      </CustomTabPanel>
    </Paper>
  );
};

export default SignInOutContainer;
