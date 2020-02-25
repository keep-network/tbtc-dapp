import React from 'react';

import '../../css/news-item.scss'

const NewsItem = ({ title, date, body }) => {
    const paragraphs = body.split('\n\n').map(x => x.trim())

    return <div className="news">
        <div className="title">
            News
        </div>

        <div className='divider'></div>

        <div class="container">
            <div className='news-item'>
                <header>
                    <div>{date}</div>
                    <div>tBTC ANNOUNCEMENT</div>
                </header>

                <h2>
                    {title}
                </h2>
                
                <div class='body'>
                    {paragraphs.map(copy => <p dangerouslySetInnerHTML={{ __html: copy }} />)}
                </div>
            </div>
        </div>
    </div>
}

export default NewsItem
