//Un médicament est caractérisé par un identifiant, une dénomination, une forme pharmaceutique, une photo et une quantité en stock.
export class Medicament {

    //Constructeur
    constructor(id, denomination, formepharmaceutique, photo, qte= 1) {
      this.id = id;
      this.denomination = denomination;
      this.formepharmaceutique = formepharmaceutique;
      this.photo = photo;
      this.qte = qte;
    }
}