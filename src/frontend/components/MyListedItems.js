import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import poetry from './genres_images/poetry.png'
import humor from './genres_images/humor.png'
import drama from './genres_images/drama.png'
import bio from './genres_images/bio.png'
import fiction from './genres_images/fiction.png'

import './graphic.css';

const genre_image = {
  "Drama": drama,
  "Humor": humor,
  "Poetry": poetry,
  "Bio": bio,
  "Fiction": fiction
}

function renderSoldItems(items) {
  return (
    <>
      <div class="listtext">Sold</div>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Body color="secondary">
                <Card.Title><span class="itemtitle">{item.name}</span></Card.Title>
                <Card.Text>
                  Description: {item.description}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH
              </Card.Footer>
              <Card.Footer>
                <div className='d-grid'>
                    <Button onClick={(e) => { 
                        e.preventDefault();
                        window.open(item.data_link, "_blank");
                    }}
                    variant="outline-success"
                    size="lg"
                    > View Content</Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}


export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId)
        // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: genre_image[metadata.genre],
          data_link: metadata.image
        }
        listedItems.push(item)
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }
  useEffect(() => {
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <div class="apptext">Loading...</div>
    </main>
  )
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
          <div class="listtext">Listed</div>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title><span class="itemtitle">{item.name}</span></Card.Title>
                    <Card.Text>
                      Description: {item.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                  <Card.Footer>
                    <div className='d-grid'>
                        <Button onClick={(e) => { 
                            e.preventDefault();
                            window.open(item.data_link, "_blank");
                        }}
                        variant="outline-success"
                        size="lg"
                        > View Content</Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <div class="apptext">No listed assets</div>
          </main>
        )
      }
    </div >
  );
}