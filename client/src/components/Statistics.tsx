import { getStatistics } from '../utils/apiCalls'


export const Statistics = ({username} : {username: string}) => {
    const stats = getStatistics(username)

    return (
        <div className="statisticsContainer">
            <div className="userData">
                {username}
            </div>

            <div className="statisticsList">
                <div className="statisticsItemWrapper">
                    <div className="colHeader">Right Chars</div>
                    <div className="colHeader">Wrong Chars</div>
                    <div className="colHeader">Total Time</div>
                </div>

                <br></br>

                {
                    stats && 
                    stats.map(elem => {
                        return (
                            <>
                                <div className="statisticsItemWrapper">
                                    <div className="statisticsItem">{elem.rightWords}</div>
                                    <div className="statisticsItem">{elem.wrongWords}</div>
                                    <div className="statisticsItem">{elem.totalTime}</div>
                                </div>
                                <br></br>
                            </>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Statistics