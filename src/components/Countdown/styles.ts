import styled from 'styled-components';
import { device } from '@/styles/device';

export const Container = styled.div<{ isActive: boolean }>`
  .clock {
    align-items: center;
    color: var(--title);
    display: flex;
    font-family: Rajdhani;
    font-weight: 600;

    > div {
      align-items: center;
      background: var(--shape);
      border-radius: 5px;
      box-shadow: 0 0 60px rgba(0, 0, 0, 0.05);
      display: flex;
      flex: 1;
      font-size: 8.5rem;
      justify-content: space-evenly;
      text-align: center;
      min-width: 12.5rem;

      @media ${device.mobileL} {
        min-width: auto;
      }

      span {
        flex: 1;

        &:first-child {
          border-right: solid 1px var(--clockBackgroundBorder);
        }

        &:last-child {
          border-left: solid 1px var(--clockBackgroundBorder);
        }
      }
    }

    > span {
      font-size: 6.25rem;
      margin: 0 0.5rem;
    }
  }

  button {
    align-items: center;
    background: ${(props) => (props.isActive ? 'var(--white)' : 'var(--blue)')};
    border-radius: 5px;
    border: 0;
    color: ${(props) => (props.isActive ? 'var(--title)' : 'var(--white)')};
    display: flex;
    font-size: 1.25rem;
    font-weight: 600;
    height: 5rem;
    justify-content: center;
    margin-top: 2rem;
    width: 100%;
    transition: background 300ms ease;

    &:hover {
      background: ${(props) =>
        props.isActive ? 'var(--red)' : 'var(--blue-dark)'};
      color: ${(props) => (props.isActive ? 'var(--white)' : '')};

      img {
        filter: ${(props) =>
          props.isActive ? 'brightness(0) invert(1);' : ''};
      }
    }

    &:disabled {
      background: var(--white);
      border-bottom: solid 4px var(--green);
      color: var(--text);
      cursor: default;
    }

    img {
      margin-left: 1rem;
    }
  }
`;
