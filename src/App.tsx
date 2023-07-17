import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./config/apollo";
import { IndexPage } from "./pages/index";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <IndexPage />
    </ApolloProvider>
  );
}

export default App;
