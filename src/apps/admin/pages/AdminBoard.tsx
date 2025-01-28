import { Link } from 'react-router-dom'
import boardImage from 'src/assets/img/boardImage.png'
import './AdminBoard.scss'

export const AdminBoard = () => {
  return (
    <>
      <div>
        <div className="header">Boards</div>
        <div className="grid">
          <div className="board-row col-12 grid">
            <div className="Board col-4">
              <Link to="/boards/1" target="_blank">
                <img
                  src={boardImage}
                  className="boardImage"
                  alt="Board Image"
                ></img>
              </Link>
            </div>
            <div className="Board col-4">
              <Link to="/boards/2" target="_blank">
                <img
                  src={boardImage}
                  className="boardImage"
                  alt="Board Image"
                ></img>
              </Link>
            </div>
            <div className="Board col-4">
              <Link to="/boards/3" target="_blank">
                <img
                  src={boardImage}
                  className="boardImage"
                  alt="Board Image"
                ></img>
              </Link>
            </div>
          </div>
          <div className="board-row col-12 grid">
            <div className="Board col-4">
              <img
                src={boardImage}
                className="boardImage"
                alt="Board Image"
              ></img>
            </div>
            <div className="Board col-4">
              <img
                src={boardImage}
                className="boardImage"
                alt="Board Image"
              ></img>
            </div>
            <div className="Board col-4">
              <img
                src={boardImage}
                className="boardImage"
                alt="Board Image"
              ></img>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
