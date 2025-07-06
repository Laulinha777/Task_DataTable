function format(aluno) {
    return `
    <div>
        <strong>Modalidade de Estágio:</strong> ${aluno.modalidade_estagio.join(", ")}<br>
        <strong>Competências:</strong> ${aluno.competencias.join(", ")}<br>
        <strong>Já estagiou?:</strong> ${aluno.ja_estagiou.toLowerCase() === "true" ? "Sim" : "Não"}<br>
        <strong>Autoriza o uso de imagem?:</strong> Sim
    </div>
    `;
}

$(document).ready(function () {
    let ultimaLinhaSelecionada = null;

    const tabela = $('#alunos-tabela').DataTable({
        ajax: {
            url: 'http://localhost:3000/api/alunos',
            dataSrc: ''
        },
        columns: [
            {
                className: 'details-control',
                orderable: false,
                data: null,
                defaultContent: "+"
            },
            { data: 'id' },
            { data: 'nome' },
            { data: 'email' },
            { data: 'curso' },
            { data: 'ano_graduacao' },
            { data: 'cpf' },
            { data: 'telefone' },
            { data: 'cidade' },
            { data: 'pais' },
            { data: 'etnia' }
        ],
        ordering: false
    });

    $('#alunos-tabela tbody').on('click', 'tr', function (evento) {
        // Ignora se clicou no +
        if ($(evento.target).hasClass('details-control')) return;

        const index = tabela.row(this).index();

        if (evento.shiftKey && ultimaLinhaSelecionada !== null) {
            const start = Math.min(ultimaLinhaSelecionada, index);
            const end = Math.max(ultimaLinhaSelecionada, index);

            for (let i = start; i <= end; i++) {
                const node = tabela.row(i).node();
                $(node).addClass('selected');
            }
        } else {
            $(this).toggleClass('selected');
            ultimaLinhaSelecionada = index;
            //Apenas vai selecionar ou desselecionar a linha clicada
        }
    });

    $('#alunos-tabela tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = tabela.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
            $(this).text('+');
        } else {
            row.child('<div>Carregando...</div>').show();
            tr.addClass('shown');
            $(this).text('-');

            const alunoId = row.data().id;

            $.ajax({
                url:`http://localhost:3000/api/aluno?id=${alunoId}`,
                method: 'GET',
                success: function (alunoDetalhes) {
                    row.child(format(alunoDetalhes)).show();
                },

                error: function () {
                    row.child('<div>Erro ao carregar detalhes.</div>').show();
                }
            });
        }
    });
});
