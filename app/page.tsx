import styles from "./page.module.css";
import Image from "next/image";
import foto from "@/public/photo.png";
import WaterDragImages from "./components/WaterDragImages";

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.contenedor}>
        <div className={styles.retrato}>
          <Image src={foto} alt="Foto de retrato" />
        </div>
        <div className={styles.informacion}>
          <h1>ANTONY CRESPIN</h1>
          <div className={styles.informacion_fotos}>
            <WaterDragImages />
          </div>
          <h2>DISEÑADOR</h2>
          <h2>GRÁFICO</h2>
          <p>DCRIS3344@GMAIL.COM</p>
        </div>
        <div className={styles.datos}>datos</div>
      </div>
    </main>
  );
}
