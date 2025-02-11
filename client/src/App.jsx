import { useState } from "react";
import MailAgent from "./components/MailAgent";


function App() {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <>
      {/* {authenticated ? (
        <div className=" h-full w-full">
          <Layout />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Button
            onClick={() => {
              setAuthenticated(true);
            }}
          >
            Login
          </Button>
        </div>
      )} */}
    <MailAgent/>
    </>
  );
}

export default App;
