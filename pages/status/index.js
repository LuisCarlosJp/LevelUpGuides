import useSWR from "swr";
import styles from "./status.module.css"
import { Inter } from 'next/font/google'
 
const inter = Inter({ subsets: ['latin'] })

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <div className={`${styles.background} ${inter.className}`}>
        <h1 >Status</h1>
        <UpdatedAt />
        <div className={styles.grid}>
          <DatabaseStatus />
          <DatabaseVersion />
          <MaxConnections />
          <OpenConnections />
        </div>
      </div>
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updated_at = "Loading ...";

  if (!isLoading && data) {
    updated_at = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <p>Last updated: {updated_at}</p>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let health = "Loading ...";
  let statusColor = "#e78284";

  if (!isLoading && data) {
    health = data.dependencies.database.version? "Healthy": "Degraded";
  };
  if (health === "Healthy") {
    statusColor = "#a6d189";
  };
  return (<div>Database Status:<hr /> <div><span style={{color: statusColor}}>●</span> health</div></div>);
}

function DatabaseVersion() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let version = "Loading ...";

  if (!isLoading && data) {
    version = data.dependencies.database.version;
  }
  return <div>Version:<hr /> <div>{version}</div> </div>;
}

function MaxConnections() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let max_connections = "Loading ...";

  if (!isLoading && data) {
    max_connections = data.dependencies.database.max_connections;
  }
  return <div>Max Connections:<hr />  <div>{max_connections}</div> </div>;
}

function OpenConnections() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let open_connections = "Loading ...";

  if (!isLoading && data) {
    open_connections = data.dependencies.database.opened_connections;
  }
  return <div>Open Connections:<hr />  <div>{open_connections}</div> </div>;
}