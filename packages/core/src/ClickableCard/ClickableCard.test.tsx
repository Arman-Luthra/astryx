// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {ClickableCard} from './ClickableCard';

describe('ClickableCard', () => {
  it('renders children', () => {
    render(
      <ClickableCard label="Test card" onClick={() => {}}>
        <span>Card content</span>
      </ClickableCard>,
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders a hidden button for onClick cards', () => {
    render(
      <ClickableCard label="Test card" onClick={() => {}}>
        <span>Content</span>
      </ClickableCard>,
    );
    const button = screen.getByRole('button', {name: 'Test card'});
    expect(button).toBeInTheDocument();
  });

  it('renders a hidden link for href cards', () => {
    render(
      <ClickableCard label="Nav card" href="/settings">
        Content
      </ClickableCard>,
    );
    const link = screen.getByRole('link', {name: 'Nav card'});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/settings');
  });

  it('calls onClick when card surface is clicked', () => {
    const handleClick = vi.fn();
    render(
      <ClickableCard label="Test card" onClick={handleClick}>
        <span>Content</span>
      </ClickableCard>,
    );
    // Click the card surface (the text), not the hidden button
    fireEvent.click(screen.getByText('Content'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClick when a nested button is clicked', () => {
    const handleCardClick = vi.fn();
    const handleButtonClick = vi.fn();
    render(
      <ClickableCard label="Test card" onClick={handleCardClick}>
        <button type="button" onClick={handleButtonClick}>
          Nested
        </button>
      </ClickableCard>,
    );
    fireEvent.click(screen.getByText('Nested'));
    expect(handleButtonClick).toHaveBeenCalledTimes(1);
    // Card's onClick should NOT fire because click was on a nested interactive
    expect(handleCardClick).not.toHaveBeenCalled();
  });

  it('hidden button has correct aria-label', () => {
    render(
      <ClickableCard label="Settings card" onClick={() => {}}>
        Content
      </ClickableCard>,
    );
    const button = screen.getByRole('button', {name: 'Settings card'});
    expect(button).toHaveAttribute('aria-label', 'Settings card');
  });

  it('hidden link passes target attribute', () => {
    render(
      <ClickableCard
        label="External"
        href="https://example.com"
        target="_blank">
        Content
      </ClickableCard>,
    );
    const link = screen.getByRole('link', {name: 'External'});
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('disabled button is disabled', () => {
    const handleClick = vi.fn();
    render(
      <ClickableCard label="Disabled" onClick={handleClick} isDisabled>
        Content
      </ClickableCard>,
    );
    const button = screen.getByRole('button', {name: 'Disabled'});
    expect(button).toBeDisabled();
  });

  it('disabled link has aria-disabled', () => {
    render(
      <ClickableCard label="Disabled link" href="/settings" isDisabled>
        Content
      </ClickableCard>,
    );
    const link = screen.getByRole('link', {name: 'Disabled link'});
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  // The interaction feedback is a hover/active tint applied to the card's own
  // background (via var(--_card-bg)), not a pseudo-element overlay. Because a
  // background paints across the full border box, this covers the 1px
  // transparent border that non-`default` variants carry — so no faint 1px
  // ring shows on hover. These tests lock in that the tint styles are applied
  // for both default and non-default variants, and removed when disabled.
  it('applies the background tint styles on the default variant', () => {
    const {container} = render(
      <ClickableCard label="Default card" variant="default">
        Content
      </ClickableCard>,
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ClickableCard__styles.tint');
    expect(card.className).toContain(
      'ClickableCard__styles.tintHoverOnPointer',
    );
  });

  it('applies the background tint styles on non-default variants', () => {
    const {container} = render(
      <ClickableCard label="Blue card" variant="blue">
        Content
      </ClickableCard>,
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ClickableCard__styles.tint');
    expect(card.className).toContain(
      'ClickableCard__styles.tintHoverOnPointer',
    );
  });

  it('does NOT apply the tint styles when disabled', () => {
    const {container} = render(
      <ClickableCard label="Disabled blue" variant="blue" isDisabled>
        Content
      </ClickableCard>,
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('ClickableCard__styles.tint');
  });
});
