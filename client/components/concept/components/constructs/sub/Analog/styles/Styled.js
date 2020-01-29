import styled from 'styled-components';
import './scss/_analog.scss';
const AnalogWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  box-sizing: border-box;

  // outline: thin solid red;
  &:hover:before{
    position: absolute;
    opacity: .75;
    z-index: -1;
    pointer-events: none;
    display: block;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    content: '';
    background-color: white;
  }
  .pos-left{ justify-self: flex-start; }

  .spw-analog-component { 
    display: inline-flex; 
  }
  
  // center
`;

export default AnalogWrapper;
