import useSWR from "swr";
import styles from "./status.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <div className={inter.className}>
        <h1>Status</h1>
        <UpdatedAt />
        <div className={styles.grid}>
          <DatabaseStatus />
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
  let postgresVersion = "Loading ...";
  let maxConnections = "Loading ...";
  let openedConnections = "Loading ...";

  if (!isLoading && data) {
    postgresVersion = data.dependencies.database.version;
    health = data.dependencies.database.version ? "Healthy" : "Degraded";
    maxConnections = data.dependencies.database.max_connections;
    openedConnections = data.dependencies.database.opened_connections;
  }
  if (health === "Healthy") {
    statusColor = "#a6d189";
  }
  return (
    <>
      <div>
        Database Status:
        <hr />
        <div>
          <span style={{ color: statusColor }}>●</span> {health}
        </div>
      </div>

      <div>
        Version:
        <hr />
        <div>{postgresVersion}</div>
      </div>

      <div>
        Max Connections:
        <hr />
        <div>{maxConnections}</div>
      </div>

      <div>
        Open Connections:
        <hr />
        <div>{openedConnections}</div>
      </div>
    </>
  );
}
