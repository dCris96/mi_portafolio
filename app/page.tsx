import styles from "./page.module.css";
import Image from "next/image";
import foto from "@/public/photo.png";
import WaterDragImages from "./components/WaterDragImages";

export default function Page() {
  return (
    <div className={styles.main}>
      <div className={styles.contenedor}>
        <div className={styles.retrato}>
          <Image src={foto} alt="Foto de retrato" priority />
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
      </div>

      <section className={styles.datos}>
        <div className={styles.stat}>
          <div className={styles.statNum}>1+</div>
          <div className={styles.statLabel}>Years of experience</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statNum}>40+</div>
          <div className={styles.statLabel}>Proyects</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statNum}>95%</div>
          <div className={styles.statLabel}>Recommendation</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statNum}>0</div>
          <div className={styles.statLabel}>Missed deadlines</div>
        </div>
      </section>
    </div>
  );
}
