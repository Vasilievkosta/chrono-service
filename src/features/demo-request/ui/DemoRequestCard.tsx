import { useGetDemoMessageQuery } from "../api/demoRequestApi"

export function DemoRequestCard() {
  const { data, error, isLoading } = useGetDemoMessageQuery()

  return (
    <section className="info-card data-card">
      <div>
        <h2>RTK Query example</h2>
        <p>Ниже показан пример базового запроса к mock API.</p>
      </div>

      {isLoading && <div className="loader">Loading mock data...</div>}

      {Boolean(error) && <div className="error-text">Не удалось получить mock response.</div>}

      {data && (
        <>
          <div className="data-card__meta">ID: {data.id}</div>
          <div>
            <strong>{data.title}</strong>
          </div>
          <p>{data.description}</p>
          <div className="status">Status: success</div>
        </>
      )}
    </section>
  )
}
