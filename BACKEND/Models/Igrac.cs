﻿namespace BACKEND.Models
{
    public class Igrac : Entitet
    {
        public string Ime { get; set; } = "";
        
        public ICollection<Clan> Clanovi { get; set; }
    }
}
