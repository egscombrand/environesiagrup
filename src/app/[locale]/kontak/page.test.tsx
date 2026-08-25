import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import KontakPage from './page';

describe('KontakPage', () => {
  it('renders the heading and the confirmed office address', async () => {
    render(await KontakPage({ params: Promise.resolve({ locale: 'id' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Kontak' })).toBeInTheDocument();
    expect(screen.getByText(/Jl\. Jati Mataram No\. 284B/)).toBeInTheDocument();
    expect(screen.getByText(/55284/)).toBeInTheDocument();
  });

  it('renders the address inside a semantic address element', async () => {
    const { container } = render(await KontakPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(container.querySelector('address')).toBeInTheDocument();
  });

  it('explains that the contact form is not yet available', async () => {
    render(await KontakPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(
      screen.getByText('Formulir kontak akan tersedia setelah kebijakan privasi terbit.')
    ).toBeInTheDocument();
  });

  it('does not render a form', async () => {
    const { container } = render(await KontakPage({ params: Promise.resolve({ locale: 'id' }) }));
    expect(container.querySelector('form')).not.toBeInTheDocument();
  });
});
