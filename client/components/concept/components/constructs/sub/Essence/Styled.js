import styled from 'styled-components';
import './scss/_essence.scss';

const StyledEssence = styled.div`
  position: relative;
  .delimited-construct-body-item-list {
    flex-direction: column;
  }
  &:hover{
    z-index: 4;
  }
  &:hover:before{
    position: absolute;
    opacity: .08;
    display: block;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    content: '';
    background-color: ${p => p.color ? p.color.hex() : 'transparent'};
  }
  &:hover:after{
    position: absolute;
    opacity: .2;
    display: block;
    z-index: -1;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    content: '';
    outline: thin solid ${p => p.color ? p.color.hex() : 'transparent'};
  }
  .spw-delimiter{
  cursor: pointer;
    > *{
        top: 0;
        bottom: 0;
    }
  }
`;

export default StyledEssence;
