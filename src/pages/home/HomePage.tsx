import { DemoRequestCard } from '../../features/demo-request/ui/DemoRequestCard';
import { OrderForm } from '../../features/order-form/ui/OrderForm';

export function HomePage() {
  return (
    <section className="page">
      <div className="hero-card">
        <h1>Watch repair order</h1>
        <p>
          Fill out the form to create a repair request. The form validates data
          on the client and logs the final object to the console.
        </p>
      </div>

      <OrderForm />
      <DemoRequestCard />
    </section>
  );
}
