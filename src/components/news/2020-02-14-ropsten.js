import React, { Component } from 'react';
import NewsItem from "./NewsItem"

export default () => {
    let data = {
        title: "tBTC on Ropsten",
        date: '02.12.2020',
        body: `Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam id dolor id nibh ultricies vehicula ut id elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.

        Donec ullamcorper nulla non metus auctor fringilla. Maecenas faucibus mollis interdum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Sed posuere consectetur est at lobortis. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        
        Etiam porta sem malesuada magna mollis euismod. Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur.
        
        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec id elit non mi porta gravida at eget metus. Nulla vitae elit libero, a pharetra augue. Etiam porta sem malesuada magna mollis euismod.
        
        Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam id dolor id nibh ultricies vehicula ut id elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
        
        Donec ullamcorper nulla non metus auctor fringilla. Maecenas faucibus mollis interdum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Sed posuere consectetur est at lobortis. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        
        Etiam porta sem malesuada magna mollis euismod. Curabitur blandit tempus porttitor. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur.
        
        Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec id elit non mi porta gravida at eget metus. Nulla vitae elit libero, a pharetra augue. Etiam porta sem malesuada magna mollis euismod.`
    }
    return <NewsItem {...data}/>
}