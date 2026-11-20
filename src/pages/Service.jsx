import Services from "../components/Hero_Service"
import InstagramStrip from "../instagram/InstagramStrip"

export default function ServicesPage(){
    return(
        <>
            <Services/>
            <InstagramStrip start={4} heading="Explore our latest posts" />
        </>
    )
}