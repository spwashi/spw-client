import styled from 'styled-components';


export default styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  flex-wrap: nowrap;

  .spw-body {
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;

    > .item-wrapper {
      width: 100%;
      justify-content: center; 
      flex-wrap: nowrap;
      text-align: center;

      &:last-of-type {
        padding-bottom: 0;
      }
    }

  }


  .spw-token {
    display: block;
    &.spw-close {
      align-items: flex-end;
      z-index: -10;

      &:hover {
        cursor: pointer;
      }
    }
  }
`;
